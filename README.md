# Flickr image gallery

This application was created to test the Flickr API, how loading in
images and searching images through tags is done. The user is able to
sign up and save images they like as bookmarks. You can then review
your bookmarks and remove some bookmarks if you don't want to have them anymore. Did I mention
that there is an infinite scroll? Because there is! You never need to reload
the page to get new images, you can stay at the website forever!

## How to run the application

To load all the dependencies open up your command line and navigate to the root of the
project and execute using one of the following commands:

```bash
npm install
```

or

```bash
yarn install
```

### Replace .env variables to make the application run

To get the application to run you need to first replace some of the .env variables.
These ones in particular:

```
JWT_SECRET = YOUR_JWT_SECRET
MONGO_URI = YOUR_MONGO_URI
FLICKR_KEY = YOUR_KEY
FLICKR_SECRET = YOUR_SECRET
```

### Start the server

Once the previous steps are completed you can start the server using one 
of the following commands:

```bash
npm run start
```

or

```bash
yarn start
```

## Thats it!

You can now browse all the images Flickr has to offer! Woooo!