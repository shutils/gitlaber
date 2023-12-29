function! gitlaber#ui#open_main_panel() abort
  tabnew
  call setline(1, 'Main panel')
  call gitlaber#keymap#set_base_keymap()
  call gitlaber#ui#set_base_option()
  call gitlaber#keymap#set_main_panel_keymap()
endfunction

function! gitlaber#ui#open_project_issue_panel() abort
  botright new
  call setline(1, 'Project issue panel')
  call gitlaber#keymap#set_base_keymap()
  call gitlaber#ui#set_base_option()
  call gitlaber#keymap#set_issue_panel_keymap()
endfunction

function! gitlaber#ui#open_project_issue_list_panel() abort
  vertical botright new
  call gitlaber#keymap#set_base_keymap()
  call gitlaber#keymap#set_issue_list_panel_keymap()
endfunction

function! gitlaber#ui#open_issue_preview_panel() abort
  horizontal belowright new
  call gitlaber#keymap#set_base_keymap()
endfunction

function! gitlaber#ui#set_base_option() abort
  setlocal buftype=nofile
  setlocal nonumber
  setlocal nomodifiable
endfunction
