# webdriver installation https://chromedriver.chromium.org/downloads

# automated browser set-up
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# doesnt work if the lyrics are not integrated in the google search result page
def getLyricsGoogle(search, driver):
    searchQuery = search.replace(' ', '+')
    try:
        # open browser and url
        driver.get("https://www.google.com/search?q=" + searchQuery + "+lyrics")
        # the classes '.xaAUmb' and '.ujudUb' may change
        # web scrape
        lyrics = driver.find_elements(By.CSS_SELECTOR, '.xaAUmb .ujudUb span')
    except:
        return ''
    # format lyrics text, save lyrics as single string
    lyricText = ''
    for line in lyrics:        
        lyricText += ' ' + line.text

    return lyricText

# web scrape from AZlyrics.com
def getLyricsAZlyrics(song, artist, driver):
    artist = artist.replace(' ', '')
    song = song.replace(' ', '')
    driver.get('https://www.azlyrics.com/lyrics/' + artist.lower() + '/' + song.lower() + '.html')
    try:
        lyrics = driver.find_element(By.CSS_SELECTOR, 'body > div.container.main-page > div > div.col-xs-12.col-lg-8.text-center > div:nth-child(8)')
    except:
        lyrics = ''
    return lyrics

def main(song, artist):
    ser = Service("\Development\chromedriver.exe")
    op = webdriver.ChromeOptions()
    op.add_argument('headless')
    op.add_argument('disable-gpu')
    driver = webdriver.Chrome(service=ser, options=op)

    search = song + " " + artist
    lyrics = getLyricsGoogle(search, driver)
    # if lyrics == '':
    #     lyrics = getLyricsAZlyrics(song, artist, driver)
    # driver.quit()
    return lyrics
# print(main("dream on", "aerosmith"))