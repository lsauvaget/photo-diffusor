const configs = {};

configs.public = {
    absPath: `${__dirname}/public`,
};

configs.public.images = {
  publicPath: '/images',
  absPath:`${configs.public.absPath}/images`,
}


module.exports = configs;
