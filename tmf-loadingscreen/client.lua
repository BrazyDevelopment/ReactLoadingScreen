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
    SetNuiFocus(false, false)   
end)

AddEventHandler('playerConnecting', function(_, _, deferrals)
    local source = source
    deferrals.handover({
        name = GetPlayerName(source)  -- Send the player's name
    })
end)