function! gitlaber#denops#open_main_panel() abort
  call denops#notify('gitlaber', 'doAction', [{'name': 'project:status'}])
endfunction
