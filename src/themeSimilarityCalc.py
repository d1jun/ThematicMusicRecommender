from nltk.corpus import wordnet

# discard text that is not the similiarty metric calculation
def trim(similarity):
    metric = "0."
    zeroFlag = False
    oneFlag = False
    periodFlag = False
    for c in similarity:
        if (zeroFlag or oneFlag) and periodFlag:
            metric += c
            continue
        if c == '0' and not periodFlag:
            zeroFlag = True
            metric = "0."
            continue
        # case for 1 and -1
        if c == '1' and not periodFlag:
            oneFlag = True
            metric = "1."
            continue
        if (zeroFlag or oneFlag) and c == '.':
            periodFlag = True
    return metric

def calculate(word, theme):
    try:
        syn1 = wordnet.synsets(word)[0] # is better than syn1 = wordnet.synset(word + '.n.01') since the 1st doesnt assume the word is a noun
    except:
        return -1
    syn2 = wordnet.synsets(theme)[0] # == syn2 = wordnet.synset(theme + '.n.01') / (theme + '.v.01)
    metric = syn1.wup_similarity(syn2)
    return metric
    
    # before I found the nltk package, I had to use an online demo and scrape that data
    # driver.get("https://ws4jdemo.appspot.com/?mode=w&s1=&w1=" + word + "&s2=&w2=" + theme)
    # # web scrape
    # metric = "0."
    # # wait until calculation loads
    # while metric == "0.":
    #     similarity = driver.find_element(By.CSS_SELECTOR, '#wup_summary').text
    #     # similarity = driver.find_element(By.XPATH,'//*[@id="wup_summary"]').text
    #     metric = trim(similarity)
    # metric = float(metric)
    # return metric

def main():
    with open('tempTheme.txt') as f:
        word = f.readline()
        f.close()
    themes = ["heartbreak", "desire", "loss", "disillusionment", 
    "inspiration", "aspiration", "nostalgia", "pain", "desperation", 
    "rebellion", "escapism", "confusion", "family", "greed", 
    "friendship", "love"]

    # collect each similarity metric
    metrics = []
    for theme in themes:
        metric = calculate(word, theme)
        metrics.append(metric)

    assignedTheme = themes[0]
    maxMetric = metrics[0]
    # find max similarity metric, save that theme
    for i in range(len(metrics)):
        if metrics[i] > maxMetric:
            maxMetric = metrics[i]
            assignedTheme = themes[i]
    # print(assignedTheme)
    return assignedTheme