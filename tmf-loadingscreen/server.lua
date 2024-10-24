AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local source = source
    
    deferrals.defer()

    -- mandatory wait!
    Wait(0)

    if not playerName then
        deferrals.done("Invalid player name.")
        return
    end

    deferrals.done()
    
    TriggerClientEvent('sendPlayerName', source, playerName)
end)
