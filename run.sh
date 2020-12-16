#!/bin/bash
set -eoux pipefail
###
# @Github: https://github.com/PANG-hans/FrontEnd
# @Organization: SUSTech
# @Author: ?
# @Date: 2020-12-16 09:57:34
 # @LastEditors: !
 # @LastEditTime: 2020-12-16 10:46:25
###
var_www_html="/var/www/html"
cnpm="/mnt/f/node_modules/node_global/cnpm"
main() {
    path="$(pwd)"
    cd "${var_www_html}"
    sudo rm -rf -- *
    cd "${path}"/dist
    sudo cp -r ./static "${var_www_html}"/static
    cp ./index.html "${var_www_html}"/index.html
    sudo service nginx restart
}
main
