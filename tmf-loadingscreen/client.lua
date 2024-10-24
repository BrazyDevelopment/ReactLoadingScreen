RegisterNUICallback('loadingScreenDone', function(data, cb)
    ShutdownLoadingScreen() 
    SetNuiFocus(false, false)   
    cb('ok')
end)

AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        SendNUIMessage({ type = "loadingScreenReady" })
    end
end)

AddEventHandler('endInitFunction', function()
    SendNUIMessage({ type = "loadingComplete" })
    ShutdownLoadingScreenNui() 
end)
