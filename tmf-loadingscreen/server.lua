AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local source = source
    
    deferrals.defer()

    -- mandatory wait!
    Wait(0)

    logger:Info("Player Connecting", "Player name: " .. (playerName or 'Player'))
    deferrals.done()
    
    TriggerClientEvent('sendPlayerName', source, playerName)
end)
