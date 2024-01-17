function! gitlaber#denops#open_main_panel() abort
  call denops#notify('gitlaber', 'command:buffer:open:popup:main', [])
endfunction
