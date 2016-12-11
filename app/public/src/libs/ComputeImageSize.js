function ComputeImageSize(options) {
    const _options = Object.assign({
        imageSizeMode: 'contain'
    }, options);

    function computeMaxHeightAndMaxWidth(width, height, containerWidth, containerHeight) {
        const imageSizeMode = _options.imageSize;
        const fn =  typeof imageSizeMode === 'function' ?  imageSizeMode : _computerImageSize[imageSizeMode];
        return fn(width, height, containerWidth, containerHeight);
    }

    const _computerImageSize = {
        contain(width, height, containerWidth, containerHeight) {
            const ratio = width/height;
            const landscapeOrientation = ratio > 0;
            if(landscapeOrientation) {
                const computedMaxHeight = containerWidth / ratio;
                const computedMaxWidth = containerWidth;
                const delta = containerHeight - computedMaxHeight;
                if(delta < 0) {
                    const finalHeight = computedMaxHeight + delta;
                    const finalWidth = finalHeight * ratio;
                    return {
                        maxWidth: finalWidth,
                        maxHeight: finalHeight 
                    }
                }
                return {
                    maxWidth: computedMaxWidth,
                    maxHeight: computedMaxHeight
                }
            }else  {
                const computedMaxHeight = containerHeight;
                const computedMaxWidth = computedMaxHeight * ratio;
                const delta = containerWidth - computedMaxWidth;
                if(delta < 0) {
                    const finalWidth = computedMaxWidth + delta;
                    const finalHeight = finalHeight / ratio;
                    return {
                        maxWidth: finalWidth,
                        maxHeight: finalHeight 
                    }
                }
                return {
                    maxWidth: computedMaxWidth,
                    maxHeight: computedMaxHeight
                }
            }
        },
        cover(width, height, containerWidth, containerHeight) {
            const ratio = width/height;
            if(ratio > 1) {
                return {
                    maxWidth: containerWidth, 
                    maxHeight: containerWidth / ratio
                };
            }
            return {
                maxWidth: containerHeight, 
                maxHeight: containerHeight * ratio
            };
        }
    }
    return { computeMaxHeightAndMaxWidth }
}

module.exports =  ComputeImageSize;
