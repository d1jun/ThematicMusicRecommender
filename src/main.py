# flow: extract then send (song, artist) ==> lyricScraper.py -> outputs lyrics ==> topicModel.R -> outputs topics
# ==> themeSimilarityCalc.py -> outputs theme that is most similar to topic 
# -> access songs of that theme from theme.csv file -> output playlist of thematically related songs

import csv
import themeSimilarityCalc
import lyricScraper
import rpy2.robjects as robjects
import pandas as pd
import random
from rpy2.rinterface_lib import openrlib
import rpy2.rinterface as rinterface
# initialize embedded R
rinterface.initr()

NUM_PLAYLIST_SONGS = 20

# open a temporary csv file to write to; allow transfer of data to topicModel.R
def tempCSV(lyrics, mode):
    out_file_temp = open('songTemp.csv', mode, encoding='UTF8')
    writer_temp = csv.writer(out_file_temp, lineterminator='\n')
    # on file creation
    if mode == 'w':
        writer_temp.writerow(['lyrics'])
    writer_temp.writerow([lyrics])
    # close the file to save the data and allow topicModel.R to use it
    out_file_temp.close()

# reads user's songs from songs.csv, assigns the collection of songs a theme, outputs thematically similar songs in songList.csv
def matchTheme():
    # Open file
    in_file = open('songs.csv', encoding='UTF8')
    # Skip the heading
    heading = next(in_file)
    # Create reader object by passing the file object to reader method
    reader_obj = csv.reader(in_file)
    
    i = 0
    # store lyrics of songs in songs.csv into songTemp.csv
    for row in reader_obj:
        lyrics = lyricScraper.main(row[1], row[2])
        if lyrics != '':
            # reset songTemp.csv file and add csv header on first write
            if i == 0:
                tempCSV(lyrics, 'w')
            else:
                tempCSV(lyrics, 'a')
            i += 1
            print("scraped lyrics: " + row[1] + " by " + row[2])
        else:
            print("no lyrics: " + row[1] + " by " + row[2])

    # R is not multithreading-friendly; use this to prevent thread switching
    with openrlib.rlock:
        # execute topic modeling on lyrics from user inputed songs
        robjects.r.source("topicModel.R", encoding="utf-8")

    # store thematically similar songs to create playlist
    out_file = open('songList.csv', 'w', encoding='UTF8')
    writer = csv.writer(out_file, lineterminator='\n')
    writer.writerow(['spotify_id','song','artist','theme'])
    
    theme = themeSimilarityCalc.main()
    theme_file = pd.read_csv("themes\\" + theme + ".csv")
    rows = sum(1 for row in theme_file.iterrows())
    songsNum = NUM_PLAYLIST_SONGS if NUM_PLAYLIST_SONGS < rows else rows
    accessedSongsIndex = []
    for i in range(songsNum):
        randIndex = random.randint(0,rows-1)
        # reassign until unique index
        while randIndex in accessedSongsIndex:
            randIndex = random.randint(0,rows-1)
        writer.writerow([theme_file.iloc[randIndex][0], theme_file.iloc[randIndex][1], theme_file.iloc[randIndex][2], theme])
        accessedSongsIndex.append(randIndex)

    in_file.close()   
    out_file.close() 

# initialize the csv files of all the themes
def createThemeCSV():
    themes = ["heartbreak", "desire", "loss", "disillusionment", 
        "inspiration", "aspiration", "nostalgia", "pain", "desperation", 
        "rebellion", "escapism", "confusion", "family", "greed", 
        "friendship", "love"]
    for theme in themes:
        out = open("themes\\" + theme + ".csv", 'w', encoding='UTF8')
        writer = csv.writer(out, lineterminator='\n')
        writer.writerow(["spotify_id","song","artist"])
        out.close()

# assign a theme to all the songs in the db
def processDB():
    # Open file
    in_file = open('songdb.csv', encoding='UTF8')
    # Skip the heading
    heading = next(in_file)
    # Create reader object by passing the file object to reader method
    reader_obj = csv.reader(in_file)

    # create new db that stores song themes
    # the 'w' argument overwrites an existing file of the name; or creates a file of that name
    mode = 'a'
    out_file = open('songwithThemedb.csv', mode, encoding='UTF8')
    writer = csv.writer(out_file, lineterminator='\n')
    if mode == 'w':
        writer.writerow(['spotify_id','song','artist','theme'])

    # iterate over rows in the songdb.csv file
    for row in reader_obj:
        lyrics = lyricScraper.main(row[1], row[2])
        # add to the new db if lyrics have been scraped
        if lyrics != '':
            # create temp file to send through topicModel.R
            # mode will always be 'w' to find topic for individual songs
            tempCSV(lyrics, 'w')

            # execute topic modeling; call topicModel.R
            try:
                robjects.r.source("topicModel.R", encoding="utf-8")
            except:
                # if topicModel.R errors, assume it's a love song
                temp = open('tempTheme.txt', 'w', encoding='UTF8')
                temp_writer = csv.writer(temp, lineterminator='\n')
                temp_writer.writerow(['love'])
                temp.close()
            theme = themeSimilarityCalc.main()
            row[3] = theme
            writer.writerow(row)
            # write to specific theme.csv with id,song,artist -- use this later when acessing songs of a certain theme
            themePath = "themes\\" + theme + ".csv"
            # the 'a' argument appends to an existing file
            out_file_theme = open(themePath, 'a', encoding='UTF8')
            writer_theme = csv.writer(out_file_theme, lineterminator='\n')
            writer_theme.writerow(row[0:3])
            out_file_theme.close()
            print("scraped lyrics: " + row[1] + " by " + row[2])
        else:
            print("no lyrics: " + row[1] + " by " + row[2])
        
    in_file.close()   
    out_file.close() 

# functions that should be called
# processDB()
# matchTheme()
# createThemeCSV()