fx_version 'cerulean'
game 'gta5'

description 'Custom Loading Screen'
version '1.0.0'

loadscreen 'web/index.html'
ui_page 'web/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

files {
    'web/index.html',
    'web/dist/assets/*',
    'web/dist/*'
}

client_script 'client.lua'
