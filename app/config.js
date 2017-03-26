const configs = {};

configs.dataSources = {
    FILESYSTEM: 'fileSystem',
    FLICKR: 'flickr'
}

configs.dataSource = configs.dataSources.FILESYSTEM;
configs.public = {
    absPath: `${__dirname}/public`,
};

configs.public.images = {
  publicPath: '/images',
  absPath:`${configs.public.absPath}/images`,
}

configs.flickr = {
    apiKey: process.env.FLICK_API_KEY
};

configs.shortner = {
    key: process.env.GOOGLE_SHORTNER_API_KEY
};





module.exports = configs;
