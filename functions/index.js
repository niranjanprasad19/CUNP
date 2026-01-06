const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// FR1.2: Validate format or trigger verification on upload
// This function triggers when a file is uploaded to Storage
exports.validateIdCard = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name; // File path in the bucket
    const contentType = object.contentType; // File content type

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        return console.log('This is not an image.');
    }

    // Check if it's in the 'id-cards/' directory
    if (!filePath.startsWith('id-cards/')) {
        return console.log('Not an ID card upload.');
    }

    // path is usually id-cards/{uid}/filename
    const parts = filePath.split('/');
    if (parts.length < 2) return;
    const uid = parts[1];

    // Mark user as verification pending or verified based on logic (AI or Manual)
    // For MVP, we'll auto-verify or mark 'pending_review'
    await admin.firestore().collection('users').doc(uid).update({
        verificationStatus: 'pending_review',
        idCardPath: filePath,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('ID Card uploaded and user status updated for:', uid);
});

// FR7.2: Trigger notifications on new announcements
exports.sendAnnouncementNotification = functions.firestore
    .document('announcements/{announcementId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const clubName = newValue.club;

        // Get all students subscribed to this club
        const usersRef = admin.firestore().collection('users');
        const snapshot = await usersRef.where('subscribedClubs', 'array-contains', clubName).get();

        if (snapshot.empty) {
            console.log('No matching subscribers.');
            return;
        }

        const batch = admin.firestore().batch();

        snapshot.forEach(doc => {
            // Add a notification to the user's notification subcollection
            const notifRef = doc.ref.collection('notifications').doc();
            batch.set(notifRef, {
                title: `New Announcement from ${clubName}`,
                body: newValue.title || 'New update available',
                link: `/announcements/${context.params.announcementId}`,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                read: false
            });
        });

        await batch.commit();
        console.log(`Notifications sent to ${snapshot.size} users.`);
    });

// Scheduled function to update ongoing events status
// Runs every hour
exports.updateEventStatus = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const eventsRef = admin.firestore().collection('events');

    // Find events that started but are marked 'scheduled'
    const snapshot = await eventsRef.where('startTime', '<=', now).where('status', '==', 'scheduled').get();

    if (snapshot.empty) return null;

    const batch = admin.firestore().batch();
    snapshot.forEach(doc => {
        batch.update(doc.ref, { status: 'ongoing' });
    });

    return batch.commit();
});
