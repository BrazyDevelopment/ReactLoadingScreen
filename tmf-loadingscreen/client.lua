local function registerLoadingscreenShutdown()
    repeat
        Wait(250) 
    until NetworkIsSessionActive()

    ShutdownLoadingScreen()
    ShutdownLoadingScreenNui()
    logger:Info("Loadingscreen", "Loading screen has been shutdown")
end

RegisterNUICallback('loadingScreenDone', function(data, cb)
    SetNuiFocus(false, false)
    registerLoadingscreenShutdown()
    cb('ok')
end)

AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        SendNUIMessage({ type = "loadingScreenReady" })
    end
end)

AddEventHandler('endInitFunction', function()
    SendNUIMessage({ type = "loadingComplete" })
    SetNuiFocus(false, false)   
end)

RegisterNetEvent('sendPlayerName')
AddEventHandler('sendPlayerName', function(playerName)
    SendNUIMessage({
        type = "setPlayerName",
        name = playerName
    })
end)
