import computeCosineSimilarity from "compute-cosine-similarity";

// //Implement a TF-IDF vectorizer in JavaScript to convert media descriptions into numerical values.
const calculateTF = (documents) => {
  return documents.map((doc) => {
    const termCounts = {};
    doc.combinedFeatures.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1;
    });
    const docLength = doc.combinedFeatures.length;
    for (let term in termCounts) {
      termCounts[term] = termCounts[term] / docLength;
    }
    return { id: doc.id, termCounts, mediaType: doc.mediaType };
  });
};

const calculateIDF = (documents) => {
  const df = {};
  const totalDocs = documents.length;
  documents.forEach((doc) => {
    const uniqueTerms = new Set(doc.combinedFeatures);
    uniqueTerms.forEach((term) => {
      df[term] = (df[term] || 0) + 1;
    });
  });
  const idf = {};
  for (let term in df) {
    idf[term] = Math.log(totalDocs / df[term]);
  }
  return idf;
};

const calculateTFIDF = (tf, idf) => {
  return tf.map((docTF) => {
    const tfidf = {};
    for (let term in docTF.termCounts) {
      tfidf[term] = docTF.termCounts[term] * idf[term];
    }
    return { id: docTF.id, tfidf, mediaType: docTF.mediaType };
  });
};

export const calculateTFIDFFunction = (data) => {
  const documents = data?.map((item) => ({
    id: item.id,
    combinedFeatures: item.combinedFeatures,
    mediaType: item.mediaType,
  }));
  const tf = calculateTF(documents);
  const idf = calculateIDF(documents);
  const tfidf = calculateTFIDF(tf, idf);
  return tfidf;
};

const convertTfidfToVector = (tfidf, allTerms) => {
  return Array.from(allTerms).map((term) => tfidf[term] || 0);
};

export const getTfidfVectors = (tfidfResults) => {
  // save all unique terms
  const allTerms = new Set();
  tfidfResults.forEach((doc) => {
    Object.keys(doc.tfidf).forEach((term) => allTerms.add(term));
  });
  const allTermsArray = Array.from(allTerms);

  const tfidfVectors = tfidfResults.map((doc) => {
    return {
      id: doc.id,
      vector: convertTfidfToVector(doc.tfidf, allTermsArray),
      mediaType: doc.mediaType,
    };
  });

  return tfidfVectors;
};

// Function to calculate cosine similarity between all documents and a target document
export const computeSimilarities = (tfidfVectors, targetId) => {
  let targetTfidf;
  if (targetId === "combinedFavoriteId") {
    targetTfidf = tfidfVectors[0];
  } else {
    targetTfidf = tfidfVectors.find((tfidf) => tfidf.id === targetId);
    if (!targetTfidf) return [];
  }

  return tfidfVectors
    .filter((tfidf) => tfidf.id !== targetId) // exclude the target media
    .map((doc) => ({
      id: doc.id,
      similarity: computeCosineSimilarity(targetTfidf.vector, doc.vector),
      mediaType: doc.mediaType,
    }))
    .sort((a, b) => b.similarity - a.similarity) // sort by similarity in descending order
    .slice(0, 20); // return the top results
};

export const recommendFunction = (allMediaTogether, targetMediaId) => {
  const tfidfResults = calculateTFIDFFunction(allMediaTogether); // 1: id: 278, mediaType : "movie", tfidf: {shawshank: 0.36736498503715825, redemption: 0.1..
  //tfidfVectors, is an array where each element contains the document ID and its corresponding TF-IDF vector. getTfidfVectors processes tfidfResults to produce vectors of the same length for each document, ensuring they can be compared using cosine similarity.
  const tfidfVectors = getTfidfVectors(tfidfResults); // 0: {id: 'combinedFavoriteId', vector: Array(11745)->vector:(11745) [0.13862817750381706, 0.10237294.., mediaType: 'mix'}, 1: {id: 278, vector: Array(11745), mediaType: 'movie'}
  //similarities, is an array where each element contains the ID of a document and its similarity score with the target document.
  const similarities = computeSimilarities(tfidfVectors, targetMediaId); //[{id: 61175, similarity: 0.06520562094309339, mediaType: 'tv'}...]
  return similarities;
};
