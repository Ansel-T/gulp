## 前端自动化构建环境的搭建

 **为了UED前端团队更好的协作开发同时提高项目编码质量，我们需要将Web前端使用工程化方式构建；**

 **目前需要一些简单的功能：**

      1. 压缩HTML
      2. 检查JS
      3. 编译SASS
      4. 压缩图片
      5. 压缩CSS
      6. 压缩JS
      7. 雪碧图制作
      8. 静态服务器
      9. 代理解决跨域
      10. 打包项目



 [Gulp 中文网站](http://www.gulpjs.com.cn/)

 [gulp详细入门教程](http://www.ydcss.com/archives/18) 



### Gulp使用

 Gulp是基于 Node.js的，需要要安装 Node.js


1. 为了确保依赖环境正确，我们先执行几个简单的命令检查。

    node -v
    Node是一个基于Chrome JavaScript V8引擎建立的一个解释器
    检测Node是否已经安装，如果正确安装的话你会看到所安装的Node的版本号

2. 接下来看看npm，它是 node 的包管理工具，可以利用它安装 gulp 所需的包

    npm -v
    这同样能得到npm的版本号，装 Node 时已经自动安装了npm

3. npm介绍

    ![img](img/02.png)  


4. 开始安装Gulp

    npm install -g gulp
    全局安装 gulp

    gulp -v
    得到gulp的版本号，确认安装成功

基础安装结束



### cmd命令小技巧

```
创建空文件夹  mkdir name  name是文件夹名称
创建空文件    cd.> name.txt
删除文件夹    rd/s/q name name是文件夹名称 （物理删除）
tree命令     tree /f     显示树形结构
             tree /f > tree.txt    导出目录
```


### 集合功能
  - HTML组件化和压缩
  - 编译Sass和压缩css
  - 检查Javascript
  - 编译es6语法
  - 压缩Javascript
  - 无损压缩图片
  - 创建静态服务器
  - 设置代理解决跨域
  - 打包项目且生成压缩包
  - 结合webpack使用（选用）



### gulpfile配置文件

#### 常用的插件
    gulp-sass:            sass的编译
    gulp-autoprefixer:    自动添加css前缀
    gulp-minify-css:      压缩css一行
    gulp-uglify:          压缩js代码
    gulp-notify:          加控制台文字描述用的
    gulp-clean:           清理文件
    gulp-file-include:    include 文件用
    gulp-imagemin:        图片压缩
    imagemin-pngquant:    图片无损压缩
    gulp-cache:           检测文件是否更改
    gulp-zip:             自动打包并按时间重命名
    gulp-htmlmin:         压缩html
    merge-stream:         合并多个 stream
    gulp-util:            打印日志 log
    gulp-plumber:         监控错误
    gulp-babel:           编译ES6
    gulp-if:              条件判断
    gulp-sequence:        顺序执行
    gulp-eslint:          代码风格检测工具
    del:                  删除文件


/* 任务命令 */
gulp.task('default', function() {
    gutil.log(gutil.colors.green('开发环境：          npm run dev 或者 gulp server'));
    gutil.log(gutil.colors.green('打包项目：          npm run build 或者 gulp build --env production'));
    gutil.log(gutil.colors.green('删除文件夹：        gulp clean'));
    gutil.log(gutil.colors.green('编译js代码：        gulp jsmin'));
    gutil.log(gutil.colors.green('编译css代码：       gulp cssmin'));
    gutil.log(gutil.colors.green('编译html代码：      gulp htmlmin'));
    gutil.log(gutil.colors.green('编译图片压缩：      gulp images'));
    gutil.log(gutil.colors.green('监听所有文件：      gulp watch'));
});


#### 项目任务命令
```bash
开发环境：          npm run dev 或者 gulp server
打包项目：          npm run build 或者 gulp build --env production
删除文件夹：        gulp clean
编译js代码：        gulp jsmin
编译css代码：       gulp cssmin
编译html代码：      gulp htmlmin
编译图片压缩：      gulp images
监听所有文件：      gulp watch
```

#### gulp版本号
更改下面文件
 1.打开node_modules\gulp-rev\index.js

    第134行 manifest[originalFile] = revisionedFile;

    更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

  2.打开node_modules\rev-path\index.js

    10行 return filename + '-' + hash + ext;

    更新为: return filename + ext;

  3.打开node_modules\gulp-rev-collector\index.js
	40行let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
	更新为: let cleanReplacement =  path.basename(json[key]).split('?')[0];
  4.修改打开node_modules\gulp-rev-collector\index.js
	第50行
	/*return pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");*/
	更新为:
	var rp = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|\/\\]/g, "\\$&");
	rp = pattern + "(\\?v=(\\d|[a-z]){8,10})*";
	return rp;

#### ESLint规范代码
>ESLint
>
>为什么使用ESLint
>使用使用 ESLint 工具和代码风格检测工具，则可以辅助编码规范执行，有效控制代码质量。

ESLint 详尽使用参见 **[官方文档](http://http://eslint.org/docs/user-guide/configuring)**，**[中文文档](http://http://eslint.cn/docs/user-guide/configuring)**



