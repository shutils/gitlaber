# gitlaber

## Notice

This plugin is not yet complete.  
Breaking changes may be made to the current specifications.

## About

This plugin is an integration of [Gitlab REST API](https://docs.gitlab.com/ee/api/rest/).

## Required

[denops](https://github.com/vim-denops/denops.vim)

## Installation

Install it with your plugin manager. Below is an example of lazy.nvim.

```lua
require("lazy").setup({
  {
    "shutils/gitlaber",
    dependencies = {
      "vim-denops/denops.vim",
    },
  },
})
```

## Usage

### Setting

Since gitlaber uses Gitlab's private token, please set the environment variables as follows.

```sh
export GITLAB_TOKEN=<Your private token>
```

Also, if you use self-hosted Gitlab, you need to set the environment variables as follows.

```sh
export GITLAB_URL=<Your self hosted gitlab url>
```

GITLAB_TOKEN,GITLAB_URL can also be set in the project repository using the git config command.

```sh
git config --local gitlab.token <Your private token>
git config --local gitlab.url <Your self hosted gitlab url>
```

If token and url are set in git config, those values will be used with highest priority.

### `Gitlaber` command

This command will open a new tab and display gitlaber main panel.

### Panels

gitlaber has several panels.
Each panel has a default keymap.

#### Main panel

| Function         | Key map | Implemented        |
| ---------------- | ------- | ------------------ |
| Open issue panel | i       | :white_check_mark: |
| Open wiki panel  | w       |                    |
| Open in browser  | o       |                    |
| Quit             | q       | :white_check_mark: |

#### Issue panel

| Function                 | Key map | Implemented        |
| ------------------------ | ------- | ------------------ |
| Open issue list          | l       | :white_check_mark: |
| Create new project issue | n       | :white_check_mark: |
| Quit                     | q       | :white_check_mark: |

## Roadmap

This plugin will implement the following functions.

### Core feature

- [ ] Project operation
  - [ ] Summary representation
  - [ ] Open in browser
  - [ ] View members
  - [ ] List of milestones
- [ ] Issue operation
  - [x] Create a new issue
  - [x] View issue list
  - [x] View a issue description
  - [ ] View a issue with comment
  - [x] Edit a issue description
  - [x] Delete a issue
  - [ ] View change history
  - [ ] Search issue
  - [ ] Change issue state _NOTE:_ close or reopen
  - [ ] Change issue assignee
  - [ ] Change issue label
  - [ ] Create related branches
  - [ ] Create related merge request
  - [ ] Open in browser
- [ ] Wiki operation
  - [ ] Create a new wiki
  - [ ] View wiki list
  - [ ] View a wiki
  - [ ] Edit a wiki
  - [ ] Delete a wiki
  - [ ] View change history
- [ ] Merge request operation
  - [ ] Create a new mr
  - [ ] View a mr description
  - [ ] View a mr with comment
  - [ ] Edit a mr description
  - [ ] Delete a mr
  - [ ] View change history
  - [ ] Search mr

### Other feature

- [ ] Custom keymap config

## License

MIT
