local resourceName = GetCurrentResourceName()
local isLoading = true
local loadingStages = {
    "Establishing connection",
    "Loading player data",
    "Synchronizing world state",
    "Loading map and assets",
    "Initializing scripts",
    "Finalizing"
}
local currentStage = 1

-- Function to update loading progress
local function UpdateLoadingProgress()
    local progress = math.floor((currentStage / #loadingStages) * 100)
    SendNUIMessage({
        type = "updateLoadingProgress",
        progress = progress,
        stage = loadingStages[currentStage]
    })
end

-- Function to handle actual loading logic
local function PerformLoading()
    -- Stage 1: Establishing connection
    currentStage = 1
    UpdateLoadingProgress()
    while not NetworkIsSessionStarted() do
        Wait(100)
    end

    -- Stage 2: Loading player data
    currentStage = 2
    UpdateLoadingProgress()
    local playerId = PlayerId()
    while not IsPlayerSwitchInProgress() do
        Wait(100)
    end

    -- Stage 3: Synchronizing world state
    currentStage = 3
    UpdateLoadingProgress()
    while not HasCollisionLoadedAroundEntity(PlayerPedId()) do
        Wait(100)
    end

    -- Stage 4: Loading map and assets
    currentStage = 4
    UpdateLoadingProgress()
    while not HasModelLoaded(GetHashKey("mp_m_freemode_01")) do
        RequestModel(GetHashKey("mp_m_freemode_01"))
        Wait(100)
    end

    -- Stage 5: Initializing scripts
    currentStage = 5
    UpdateLoadingProgress()
    TriggerEvent("playerSpawned")
    Wait(1000)

    -- Stage 6: Finalizing
    currentStage = 6
    UpdateLoadingProgress()
    Wait(1000)

    -- Loading complete
    isLoading = false
    SendNUIMessage({
        type = "loadingComplete"
    })

    -- Fade out loading screen
    DoScreenFadeOut(500)
    Wait(1000)
    DoScreenFadeIn(1000)

    -- Hide loading screen
    SendNUIMessage({
        showLoadingScreen = false
    })
end

-- Separate the loading screen logic into a module
local LoadingScreen = {
    -- Handle NUI callback when loading screen is ready
    onLoadingScreenReady = function(data, cb)
        print('Loading screen is ready')
        SetNuiFocus(true, true)
        SendNUIMessage({ showLoadingScreen = true })
        cb('ok')
        PerformLoading()
    end,

    -- Handle NUI callback to get player name
    getUsername = function(data, cb)
        local playerName = GetPlayerName(PlayerId())
        cb({ username = playerName })
    end,

    -- Handle NUI callback when loading screen is complete
    onLoadingScreenComplete = function(data, cb)
        print('Loading screen complete')
        SetNuiFocus(false, false)
        cb('ok')
    end
}

-- Register NUI callbacks
RegisterNUICallback('loadingScreenReady', LoadingScreen.onLoadingScreenReady)
RegisterNUICallback('getUsername', LoadingScreen.getUsername)
RegisterNUICallback('loadingScreenComplete', LoadingScreen.onLoadingScreenComplete)

-- Trigger the loadingScreenReady event when the resource starts
AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        SendNUIMessage({
            type = "loadingScreenReady"
        })
    end
end)