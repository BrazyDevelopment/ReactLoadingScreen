fx_version 'cerulean'
game 'gta5'

description 'TMF Loading Screen'
version '1.0.0'

loadscreen 'web/dist/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

files {
    'web/dist/index.html',
    'web/dist/assets/*',
    'web/dist/**/*'
}

client_script 'client.lua'
server_script 'server.lua'
