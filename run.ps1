$script = {
    function main {
       cnpm install
       cnpm run build
    }
    #Entry point
    main
}
#netsh winhttp set proxy 127.0.0.1:1080
Invoke-Command $script
