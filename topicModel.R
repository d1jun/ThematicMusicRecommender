# install.packages("word2vec")
# remove.packages("word2vec")
# Load library
library(tidyverse)
library(tokenizers)
library(quanteda)
library(stm)
setwd("C:/Development/Projects/ThematicMusicRecommender")

# Read data
#metadata <- read_csv("songs.csv")
metadata <- read_csv("songTemp.csv")

# contractions and other words the wordnet can't handle
contractions = c("doin", "something", "arent", "theres", "cant", "theyd", "couldnt", "theyll", "didnt", "theyre", "doesnt", "theyve", "dont", "wed", "hadnt", "hasnt", "weve", "havent", "werent", "hed", "whatll", "whatre", "hes", "whats", "id", "whatve", "wheres", "im", "whod", "ive", "wholl", "isnt", "lets", "whos", "mightnt", "whove", "mustnt", "wont", "shant", "wouldnt", "youd", "youll", "shes", "youre", "shouldnt", "youve", "thats")
#STM
#Process the data to put it in STM format.  Textprocessor automatically does preprocessing
temp<-textProcessor(documents=metadata$lyrics,metadata=metadata, stem = FALSE, customstopwords = contractions)
#prepDocuments removes words/docs that are now empty after preprocessing
# a word will be preserved as long it is in more than lower.thresh number of documents
out <- prepDocuments(temp$documents, temp$vocab, temp$meta, lower.thresh = 0)

model.stm <- stm(out$documents, out$vocab, K = 3)

# Find most probable words in each topic
themes <- labelTopics(model.stm)

# write theme to file
cat(themes$prob[1], file = "tempTheme.txt")
