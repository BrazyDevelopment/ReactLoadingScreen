AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local source = source
    
    deferrals.defer()
    print("Deferrals started for: " .. (playerName or 'Player'))

    -- mandatory wait!
    Wait(0)

    print("Player Connecting", "Player name: " .. (playerName or 'Player'))

    if not playerName then
        deferrals.done("Invalid player name.")
        return
    end

    print("Deferrals done for: " .. (playerName or 'Player'))
    deferrals.done()
    
    TriggerClientEvent('sendPlayerName', source, playerName)
end)
