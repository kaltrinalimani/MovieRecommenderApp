import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

// Function to fetch favorite media from Firestore for a given user
export const fetchFavoriteMediaFromFirestore = async (uid) => {
  // Get a snapshot of the documents in the user's favoriteMedia collection
  const querySnapshot = await getDocs(
    collection(db, `users/${uid}/favoriteMedia`)
  );
  let favoriteMedia = [];
  // Iterate over each document and push its data to the favoriteMedia array
  querySnapshot.forEach((doc) => {
    favoriteMedia.push(doc.data());
  });
  return favoriteMedia;
};

// Function to update favorite media in Firestore for a given user
export const updateFavoriteMediaInFirestore = async (uid, media) => {
  // Reference to the user's favoriteMedia collection
  const userRef = collection(db, `users/${uid}/favoriteMedia`);
  // Set the document with the media id as the document id, storing the media data
  await setDoc(doc(userRef, media.id.toString()), media);
};

// Function to remove favorite media from Firestore for a given user
export const removeFavoriteMediaFromFirestore = async (uid, mediaId) => {
  // Delete the document with the given media id from the user's favoriteMedia collection
  await deleteDoc(doc(db, `users/${uid}/favoriteMedia/${mediaId}`));
};
