import nlp from "compromise";
import * as sw from "stopword";

// Function to normalize and tokenize text using Compromise
const normalizeAndTokenize = (text) => {
  const doc = nlp(text);
  // Normalize the text (text lowercase, removing punctuation - except for sentence-ending punctuation, whitespace, contractions, etc.)
  const normalizedText = doc.normalize().out("text");

  // Tokenize the text
  let tokens = nlp(normalizedText).terms().out("array");

  // Remove stopwords using stopword library
  tokens = sw.removeStopwords(tokens);

  // Remove any remaining punctuation from tokens. Because normalize removes commas, semicolons - but keep sentence-ending punctuation
  tokens = tokens?.map((token) => token.replace(/[^\w\s]/gi, ""));

  // Function to perform lemmatization(Convert tokens to their base forms) using Compromise.
  // The result is a valid word. that is why i am using it instead of stemming
  tokens = lemmatizeTokens(tokens);

  return tokens;
};

const lemmatizeTokens = (tokens) => {
  return tokens?.map((token) => {
    const doc = nlp(token);
    const lemma =
      doc.verbs().conjugate()[0]?.Infinitive ||
      doc.nouns().toSingular().out("text") ||
      doc.out("normal");
    return lemma;
  });
};

// Function to preprocess text data
export const preprocessText = (text) => {
  const tokens = normalizeAndTokenize(text);
  return tokens;
};
