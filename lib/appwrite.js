import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.hanzala.GreenWheelz",
  projectId: "665233b6001dc0341b33",
  storageId: "66523880002ffdc9de76",
  databaseId: "6652367300340b08c4fb",
  userCollectionId: "665236af00329c3184f6",
  videoCollectionId: "665236ed000715add854",
  QrScannercollectionId: "665c2bbd0023c8208c01",
  rideHistorycollectionId: "66e9aba9002f7ae5c91e",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function saveRideHistory(userId, destination, destinationTitle, distanceTraveled) {
  try {
    const destinationString = `Lat: ${destination.latitude}, Lng: ${destination.longitude}`;

    const distanceAsFloat = parseFloat(distanceTraveled.toFixed(2)); // Ensure it's a float with 2 decimal precision

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.rideHistorycollectionId, // Use your actual collection ID
      ID.unique(),
      {
        userId: userId,
        destination: destinationString, // Store destination as a string
        destinationTitle: destinationTitle,
        date: new Date().toISOString(),
        distanceTraveled: distanceAsFloat, // Store distance as a float
      }
    );
    return response;
  } catch (error) {
    console.error('Error saving ride history:', error);
  }
}

export async function getRideHistory(userId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.rideHistorycollectionId, // Use your actual collection ID
      [Query.equal('userId', userId)] // Fetch rides only for the current user
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching ride history:', error);
  }
}


// Fetch stored QR Code
export async function getStoredQRCode() {
  try {
    const qrCodeDocuments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.QrScannercollectionId,
      [Query.limit(1)] // Assuming there's only one stored QR code, adjust the query if necessary
    );

    if (qrCodeDocuments.documents.length > 0) {
      return qrCodeDocuments.documents[0].Qrcode;
    } else {
      throw new Error("No QR code found");
    }
  } catch (error) {
    throw new Error(error);
  }
}

// lib/appwrite.js

export async function validateQRCode(data) {
  console.log("Validating QR Code:", data);
  
  // Example validation logic: Check if the QR code is a URL
  const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  
  const isValid = !!urlPattern.test(data);
  console.log("Is URL Pattern Valid?", isValid);
  
  return isValid;
}

// Register user
export async function createUser(email, password, username) {
  try {
    // await clearAllSessions();
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountID: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    // await clearAllSessions();
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountID", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
