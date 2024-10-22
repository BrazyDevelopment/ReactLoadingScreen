fx_version 'cerulean'
game 'gta5'

description 'Simple Loading Screen'
version '1.0.0'

loadscreen 'web/dist/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

files {
    'web/dist/index.html',
    'web/dist/**/*'
}

client_script 'client.lua'