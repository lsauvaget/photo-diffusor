const configs = {};

configs.imageSource = 'flickr' //or filesystem
configs.public = {
    absPath: `${__dirname}/public`,
};

configs.public.images = {
  publicPath: '/images',
  absPath:`${configs.public.absPath}/images`,
}

configs.flickr = {};
configs.flickr.apiKey = '0700a294e35387ab04d59292a0e4a4dd';





module.exports = configs;
