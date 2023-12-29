function! gitlaber#keymap#set_base_keymap() abort
  nnoremap <buffer> <silent> q :bd!<CR>
endfunction

function! gitlaber#keymap#set_main_panel_keymap() abort
  nnoremap <buffer> <silent> i :call gitlaber#ui#open_project_issue_panel()<CR>
endfunction

function! gitlaber#keymap#set_issue_panel_keymap() abort
  nnoremap <buffer> <silent> l :call gitlaber#core#open_project_issues()<CR>
  nnoremap <buffer> <silent> n :call gitlaber#core#create_project_issue()<CR>
endfunction

function! gitlaber#keymap#set_issue_list_panel_keymap() abort
  nnoremap <buffer> <silent> p :call gitlaber#core#open_issue_preview()<CR>
  nnoremap <buffer> <silent> d :call gitlaber#core#delete_project_issue()<CR>
endfunction
