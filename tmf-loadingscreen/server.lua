AddEventHandler('playerConnecting', function(_, _, deferrals)
    local source = source
    local playerName = GetPlayerName(source) or 'Player'
    
    logger:Info("Player Connecting", "Player name: " .. playerName)
    deferrals.done()
    
    TriggerClientEvent('sendPlayerName', source, playerName)
end)
