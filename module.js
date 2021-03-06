#!/usr/bin/env node
const OSS = require('ali-oss')
const fs = require('fs')

class AliossWebpackPlugin {
  constructor({filesPath, region, accessKeyId, accessKeySecret, bucket, directoryInOss, https}) {
    this.fileUrlsList = []
    this.filesPath = filesPath
    this.directoryInOss = directoryInOss
    this.https = https
    this.client = new OSS({
      region: region,
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      bucket: bucket,
    })
  }

  async handleDel(name, options) {
    try {
      await this.client.delete(`${this.directoryInOss}/${name}`)
    } catch (error) {
      error.failObjectName = name
      return error
    }
  }

  async deletePrefix(prefix) {
    const list = await this.client.list({
      prefix: prefix
    })
    list.objects = list.objects || []
    await Promise.all(list.objects.map((v) => this.handleDel(v.name)))
  }

  deleteAllPrefix() {
    for (let i = 0; i < this.sliceReadFiles.length; i++) {
      this.deletePrefix(this.sliceReadFiles[i])
    }
  }

  async uploadFile(name) {
    await this.client.put(`${this.directoryInOss}/${name}`, `${this.filesPath}/${name}.js`)
  }

  uploadFiles() {
    for (let i = 0; i < this.readJsFiles.length; i++) {
      const index = this.readJsFiles[i].indexOf('.js')
      const name = this.readJsFiles[i].slice(0, index)
      this.uploadFile(name)
    }
  }

  async getFileUrl(name) {
    const httpUrl = await this.client.signatureUrl(name)
    const url = httpUrl.slice(4)
    const indexOfPostfix = url.indexOf('Expires')
    const head = url.slice(0, indexOfPostfix)
    const postfix = url.slice(indexOfPostfix)
    const indexOfSignature = postfix.indexOf('Signature')
    const signature = postfix.slice(indexOfSignature)
    if(this.https){
      return 'https' + head + signature
    }else{
      return 'http' + head + signature
    }
  }

  async getFilesUrls() {
    for (let i = 0; i < this.readJsFiles.length; i++) {
      const index = this.readJsFiles[i].indexOf('.js')
      const name = this.readJsFiles[i].slice(0, index)
      const fileUrl = await this.getFileUrl(`${this.directoryInOss}/${name}`)
      this.fileUrlsList.push({name, url: fileUrl})
    }
  }

  buildPath(fileUrlsList) {
    fs.readFile(`${this.filesPath}/index.html`,'utf-8', (error, data) => {
      if(error) throw error;
      const index = data.toString().indexOf('<script src')
      const body = data.toString().slice(0, index)
      let scriptsArr = []
      if(fileUrlsList.length >= 1){
        for(let i=0; i < fileUrlsList.length; i ++){
          const url = fileUrlsList[i].url.toString()
          scriptsArr.push(`<script src='${url}'/></script>`)
        }
      }
      const postfix = '</body></html>'
      const result = body + scriptsArr.join('') + postfix

      fs.writeFile(`${this.filesPath}/index.html`, result, (error) => {
        if(error) throw error;
        console.log('修改成功')
      })
    })
  }

  async apply(compiler) {

    compiler.hooks.afterEmit.tap('AliossWebpackPlugin', async (compilation) => {
      this.readDirsAndFiles = fs.readdirSync(this.filesPath)
      this.readJsFiles = this.readDirsAndFiles.filter(dir => dir.indexOf('.js') !== -1 && dir.indexOf('.json') === -1)
      this.readCssFiles = this.readDirsAndFiles.filter(dir => dir.indexOf('.css') !== -1)
      this.sliceReadFiles = this.readJsFiles.map(file => file.slice(0, -3)).push(this.readCssFiles.slice(0,-4))

      //删除 oss bucket 的文件
      await this.deleteAllPrefix()
      // 将源文件夹中的文件上传
      setTimeout(async() => {
        await this.uploadFiles()
      }, 1000)
      //获取所有文件的相关路径 url
      await this.getFilesUrls()
      // 更改路径
      await this.buildPath(this.fileUrlsList)

    })
  }
}

module.exports = AliossWebpackPlugin
