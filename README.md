The song database consists of songs from the Billboard 200 albums from 1/5/1963 to 1/19/2019. The database in use contains data about the track ID on Spotify, track name, album name and artist name. The original database [found here](https://components.one/datasets/billboard-200/) contains more metadata about each track.

# webdriver installation https://chromedriver.chromium.org/downloads

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

import csv
import rpy2.robjects as robjects
import pandas as pd
import random

from nltk.corpus import wordnet
# install nltk
# `pip install nltk --user`
# import nltk
# nltk.download('wordnet')
# nltk.download('omw-1.4')
