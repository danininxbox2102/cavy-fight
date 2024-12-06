export class EventRegistry {
  // App related

  /**
   @description Dispatched when the app fully loaded
   **/
  public static APP_INIT_EVENT: string = 'APP_INIT_EVENT'

  /**
   @description Dispatched when main component replaced
   **/
  public static APP_VIEW_CHANGE_EVENT: string = 'APP_VIEW_CHANGE_EVENT'

  /**
  @description Dispatched when new error window is shown
  **/
  public static APP_ERROR_EVENT: string = 'APP_ERROR_EVENT'

  // Game related

  public static GAME_QUEST_COMPLETED_EVENT: string = 'GAME_QUEST_COMPLETED_EVENT'
  public static GAME_QUEST_UPDATED_EVENT: string = 'GAME_QUEST_UPDATED_EVENT'
  public static GAME_TAP_EVENT: string = 'GAME_TAP_EVENT'
}
