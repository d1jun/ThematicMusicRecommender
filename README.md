# Thematic Music Recommender
This project recommends songs using text as data. Using the lyrics of songs obtained 
via web scraping, I use structural topic modeling to assign a theme to songs in the 
song database. 

The application takes user inputted songs, extracts the lyrics, and produces a theme 
related to the entire collection of inputted songs. Next, the project outputs a 
playlist of songs of that theme. This project uses the Spotify API to handle 
user authentication. The Spotify API is also used to retrieve the user's saved 
playlists and albums, retrieve the tracks from a selected playist or album, create
a new playlist, and add new tracks to the newly created playlist.

# Original Song Database
The song database consists of songs from the Billboard 200 albums from 
1/5/1963 to 1/19/2019. The database in use contains data about the track 
ID on Spotify, track name, album name and artist name. The original 
database [found here](https://components.one/datasets/billboard-200/) 
contains more metadata about each track.

# Packages
This project requires webdriver [installation](https://chromedriver.chromium.org/downloads).

In the Python files you want to use webdriver:

```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
```

This project uses [wordnet](https://www.nltk.org/howto/wordnet.html) to calculate the similiarity between a theme and a set of lyrics. Use the package manager [pip](https://pip.pypa.io/en/stable/) to install wordnet.
```bash
pip install nltk --user
```

In the Python files you want to use wordnet:

```python
from nltk.corpus import wordnet
import nltk
# do nltk.download once
nltk.download('wordnet')
nltk.download('omw-1.4')
```

# Usage
Link to the web app
