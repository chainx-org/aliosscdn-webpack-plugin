# Aliosscdn-Webpack-Plugin

## Introduce

In order to reduce duplication of work. At every webpack build，upload js files packaged with build to oss. And get the cdn link. Then add it to the generated index.html. If you have to perform these steps every time you release a product, you will undoubtedly waste a lot of fishing time. Overtime and baldness will follow one after another. Package it as a plugin, an automation module, and realize automatic operation every time it is packaged, which will undoubtedly reduce a lot of work.

## Installation

First of all, you need to install webpack

Then install aliosscdn-webpack-plugin
```
yarn add --dev ali-oss aliosscdn-webpack-plugin
```

## Basic Usage 
```
const AliossWebpackPlugin = require('aliosscdn-webpack-plugin');

module.exports = {
    //...
    plugin: [
        https: <boolean>,
        directoryInOss: <directory name>,
        filesPath: <filesPath> // packaged path,
        region: '<Your oss region>',
        accessKeyId: '<Your oss accessKeyId>',
        accessKeySecret: '<Your oss accessKeySecret>',
        bucket: '<Your oss bucket name>'
    ]
}
```
To protect your privacy, You'd better save these oss information in a private file and put it in .gitignore!


## Result

In the index.html file after packaging by webpack: 
```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>aliosscdn-webpack-plugin</title>
</head>
<body>

<script src='http://xxxx.oss-cn-hangzhou.aliyuncs.com/main.[hash:8]?OSSAccessKeyId=xxxxxxxx'/>
</script>
<script src='http://xxxx.oss-cn-hangzhou.aliyuncs.com/runtime.[hash:8]?OSSAccessKeyId=xxxxxxxxxxxx'/></script>
</body>
</html>
```
