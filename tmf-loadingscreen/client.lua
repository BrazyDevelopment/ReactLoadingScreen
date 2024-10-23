local loadingStages = {
    "Establishing connection",
    "Loading player data",
    "Synchronizing world state",
    "Loading map and assets",
    "Initializing scripts",
    "Finalizing"
}

local function updateLoadingProgress(currentStage)
    local progress = math.floor((currentStage / #loadingStages) * 100)
    print("Current Stage: " .. currentStage)
    print("Progress: " .. progress)
    
    SendNUIMessage({ type = "updateLoadingProgress", progress = progress, stage = loadingStages[currentStage] }) -- Ensure loadingStages is defined

    Wait(500)
end

local function waitForCondition(conditionFunc)
    while not conditionFunc() do 
        Wait(100) 
    end
end

local function performLoading()
    local stageConditions = {
        function() return NetworkIsSessionStarted() end,
        function() return IsPlayerSwitchInProgress() end,
        function() return HasCollisionLoadedAroundEntity(PlayerPedId()) end,
        function() 
            -- Skip model loading if not essential
            return true 
        end,
        function()
            SendNUIMessage({ type = "loadingComplete" })
            TriggerEvent("playerSpawned")
            Wait(1000)
            return true
        end
    }

    for stage = 1, #loadingStages do
        updateLoadingProgress(stage)
        waitForCondition(stageConditions[stage])
    end
end


RegisterNUICallback('loadingScreenReady', function(_, cb)
    SetNuiFocus(true, true)
    performLoading()
    cb('ok')
end)

RegisterNUICallback('loadingScreenDone', function(data, cb)

    SetNuiFocus(false, false)  -- Remove NUI focus
    cb('ok')  -- Send a response back
end)


AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        SendNUIMessage({ type = "loadingScreenReady" })
        -- Possibly initiate loading stages here
    end
end)


RegisterNUICallback('getUsername', function(data, cb)
    local username = "Player" -- Replace this with your logic to get the username
    cb({ username = username }) -- Ensure to return a table with a username key
end)
