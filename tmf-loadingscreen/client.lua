local isLoading = true
local loadingStage = "Connecting to server..."
local loadingProgress = 0

-- Simplified loading stages
local stages = {
    {name = "Connecting to server...", duration = 2000},
    {name = "Loading game assets...", duration = 3000},
    {name = "Preparing world...", duration = 2000},
    {name = "Almost ready...", duration = 1000}
}

-- Function to update loading progress
local function UpdateLoadingProgress()
    SendNUIMessage({
        type = "updateLoadingProgress",
        progress = loadingProgress,
        stage = loadingStage
    })
end

-- Main loading function
local function StartLoading()
    -- Initial fade out
    DoScreenFadeOut(0)
    
    -- Process each loading stage
    for i, stage in ipairs(stages) do
        loadingStage = stage.name
        
        -- Calculate progress based on current stage
        local startProgress = ((i - 1) / #stages) * 100
        local endProgress = (i / #stages) * 100
        
        -- Smoothly update progress within this stage
        local timeElapsed = 0
        while timeElapsed < stage.duration do
            loadingProgress = startProgress + ((timeElapsed / stage.duration) * (endProgress - startProgress))
            UpdateLoadingProgress()
            timeElapsed = timeElapsed + 100
            Wait(100)
        end
        
        loadingProgress = endProgress
        UpdateLoadingProgress()
    end
    
    -- Loading complete
    SendNUIMessage({
        type = "loadingComplete"
    })
    
    -- Final fade in
    Wait(1000)
    DoScreenFadeIn(1000)
    isLoading = false
end

-- Handle NUI callbacks
RegisterNUICallback('getUsername', function(data, cb)
    cb({ username = GetPlayerName(PlayerId()) })
end)

RegisterNUICallback('loadingScreenComplete', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

-- Start loading when resource starts
AddEventHandler('onClientResourceStart', function(resource)
    if resource == GetCurrentResourceName() then
        SetNuiFocus(true, true)
        StartLoading()
    end
end)