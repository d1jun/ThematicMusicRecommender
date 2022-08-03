from flask import Flask, request
from flask_restful import Resource, Api
import pandas as pd
from flask_cors import CORS
import csv

# flow of API: make DELETE request to reset songs.csv, make POST requests for user tracks, make GET request for new tracks

app = Flask(__name__)
CORS(app)
api = Api(app)

class UserTracks(Resource):
    def get(self):
        data = pd.read_csv('songs.csv')  # read CSV
        data = data.to_dict()  # convert dataframe to dictionary
        return {'data': data}, 200  # return data and 200 OK code
    
    # POST request to add a song from web app to local csv file; do this iteratively for all songs
    def post(self):
        # gets URL parameters, stores as JSON/dict
        # https://tedboy.github.io/flask/generated/generated/flask.Request.html
        args = request.args

        # read our CSV
        data = pd.read_csv('songs.csv')

        if args['spotify_id'] in list(data['spotify_id']):
            return {
                'message': f"'{args['spotify_id']}' already exists."
            }, 409
        else:
            # create new dataframe containing new values
            new_data = pd.DataFrame({
                'spotify_id': [args['spotify_id']],
                'song': [args['song']],
                'artist': [args['artist']]
            })
            # add the newly provided values
            data = data.append(new_data, ignore_index=True)
            data.to_csv('songs.csv', index=False)  # save back to CSV
            return {'data': data.to_dict()}, 200  # return data with 200 OK
    
    # remove a song from songs.csv
    def patch(self):
        args = request.args  # parse arguments to dictionary
        
        # read our CSV
        data = pd.read_csv('songs.csv')
        
        if args['spotify_id'] in list(data['spotify_id']):
            # remove data entry matching given userId
            data = data[data['spotify_id'] != args['spotify_id']]
            
            # save back to CSV
            data.to_csv('songs.csv', index=False)
            return {'data': data.to_dict()}, 200
        else:
            return {
                'message': f"'{args['spotify_id']}' user not found."
            }, 404    
    
    # reset songs.csv to add new songs
    def delete(self):
        out_file = open('songs.csv', 'w', encoding='UTF8')
        writer = csv.writer(out_file, lineterminator='\n')
        writer.writerow(['spotify_id', 'song', 'artist'])
        # close the file to save the data
        out_file.close()
        data = pd.read_csv('songs.csv')  # read CSV
        data = data.to_dict()  # convert dataframe to dictionary
        return {'data': data}, 200

class NewTracks(Resource):
    # GET request to process user tracks and create new tracks locally, then new song data to webpage
    def get(self):
        from main import matchTheme
        matchTheme()

        data = pd.read_csv('songList.csv')  # read CSV
        data = data.to_dict()  # convert dataframe to dictionary
        return {'data': data}, 200  # return data and 200 OK code

    def post(self):
        # gets URL parameters, stores as JSON/dict
        # https://tedboy.github.io/flask/generated/generated/flask.Request.html
        args = request.args

        # read our CSV
        data = pd.read_csv('songList.csv')

        if args['spotify_id'] in list(data['spotify_id']):
            return {
                'message': f"'{args['spotify_id']}' already exists."
            }, 409
        else:
            # create new dataframe containing new values
            new_data = pd.DataFrame({
                'spotify_id': [args['spotify_id']],
                'song': [args['song']],
                'artist': [args['artist']]
            })
            # add the newly provided values
            data = data.append(new_data, ignore_index=True)
            data.to_csv('songList.csv', index=False)  # save back to CSV
            return {'data': data.to_dict()}, 200  # return data with 200 OK
    
    # not necessary since backend rewrites songList.csv on each call to matchTheme()
    def delete(self):
        args = request.args  # parse arguments to dictionary
        
        # read our CSV
        data = pd.read_csv('songList.csv')
        
        if args['spotify_id'] in list(data['spotify_id']):
            # remove data entry matching given userId
            data = data[data['spotify_id'] != args['spotify_id']]
            
            # save back to CSV
            data.to_csv('songList.csv', index=False)
            return {'data': data.to_dict()}, 200
        else:
            return {
                'message': f"'{args['spotify_id']}' user not found."
            }, 404    
    
api.add_resource(UserTracks, '/usertracks')  # '/usertracks' is the entry point for UserTracks
api.add_resource(NewTracks, '/newtracks')  # and '/newtracks' is the entry point for NewTracks

if __name__ == '__main__':
    app.run(debug=True)  # run  Flask app