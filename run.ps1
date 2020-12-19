$script = {
    function main {
       cnpm install
       cnpm run build
    }
    #Entry point
    #main
    npm run dev
    # pay attention now it's default address is 8080
}
#netsh winhttp set proxy 127.0.0.1:1080
Invoke-Command $script
