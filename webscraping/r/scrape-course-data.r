hardcoded.url <-
  "https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-60.html"
hardcoded.css.selector <-
  "#content-main > div > div > div.span8.ordinal-group-1 > div.parsys.content-main > div:nth-child(5) > div > div > div.content.row-fluid.accordion_accordion_panel_9 > div > div > div > div"

# import packages
library(rvest) # scraping and html parsing
library(stringr) # regex utilities
library(dplyr) # data frame manipulation
library(readr) # read and write tables

htmlpage.string <- read_html(hardcoded.url) # get the raw html
program.html.string <- htmlpage.string %>%
  html_node(css = hardcoded.css.selector) # extract desired DOM

# match "course info header" of each course on concordia web site
# ...something like 'SOEN 555    Systems'
course.info.header <- "[A-Z]{4} [0-9]{3}[[:space:]]+?[A-Z][a-z]+."

# split string on empty string before each course.info.header, convert to data frame
program.courses <- html_text(program.html.string) %>%
  str_split( paste(sep = "", "(?=(", course.info.title, "))") )

# list to data frame nonsense
program.courses <- program.courses %>% .[[1]] %>% .[-1] %>%
  as.data.frame(stringsAsFactors = FALSE)
colnames(program.courses) <- c("fullstring") # also better column name

# some cleaning of the full string of each course
program.courses[,1] <- str_trim(program.courses[,1])

# some regexes for data extraction
course.code.regex <- '[A-Z]{4} [0-9]{3}'
course.name.regex <- '[A-Z][a-z][^(]*'
credits.regex <- '\\(([0-9](\.[0-9])?[0-9]?) credits\\)'
prereqs.regex <- 'Prerequisite: ([^.]*)'

# extracting the regexes to new columns in the program.courses data frame
program.courses <- program.courses %>% # str_extract only takes first occurence of regex
  mutate(course.code = str_extract(program.courses$fullstring, course.code.regex))
program.courses <- program.courses %>%
  mutate(course.name = str_extract(program.courses$fullstring, course.name.regex) %>% str_trim)
program.courses <- program.courses %>%
  mutate(credits = str_match(program.courses$fullstring, credits.regex) %>% .[,2])
program.courses <- program.courses %>%
  mutate(prereq.string = program.courses$fullstring %>% str_match(prereqs.regex) %>% .[,2])
program.courses <- program.courses %>%
  mutate(secondhalf.string = program.courses$fullstring %>% str_split('\\. ', n = 2) %>%
         sapply(function(x) x[2]) %>% str_trim)

# remove hyphen followed by newline (concordia website programmers being lazy)
program.courses$secondhalf.string <- program.courses$secondhalf.string %>%
  str_replace('-\n', '')

# some regexes for data extraction from column 'secondhalf.string'
lectures.regex <- 'Lectures: ([^.]*)'
tutorials.regex <- 'Tutorial: ([^.]*)'
laboratory.regex <- 'Laboratory: ([^.]*)'
note.regex <- 'NOTE: (.*)'
course.description.regex <- '.*?(?=(Lecture|Tutorial|Laboratory|\nNOTE|$))'

# extracting the regex to new columns in the program.courses data frame
program.courses <- program.courses %>%
  mutate(course.description = program.courses$secondhalf.string %>% str_extract(course.description.regex))
program.courses <- program.courses %>%
  mutate(lecture.hours = program.courses$secondhalf.string %>% str_match(lectures.regex) %>% .[,2])
program.courses <- program.courses %>%
  mutate(tutorial.hours = program.courses$secondhalf.string %>% str_match(tutorials.regex) %>% .[,2])
program.courses <- program.courses %>% 
  mutate(lab.hours = program.courses$secondhalf.string %>% str_match(laboratory.regex) %>% .[,2])
program.courses <- program.courses %>%
  mutate(note = program.courses$secondhalf.string %>% str_match(note.regex) %>% .[,2])

# store and remove redundant data from program.courses data frame
full.course.strings <- program.courses$fullstring %>% as.data.frame(stringsAsFactors = FALSE)
program.courses <- program.courses %>% select(-one_of(c('fullstring')))
program.courses <- program.courses %>% select(-one_of(c('secondhalf.string')))

# store data in csv files
write_delim(full.course.strings, "aeroeng_full-course-info.csv", append = FALSE, col_names = TRUE, delim = "#")
write_delim(program.courses, "aeroeng-table.csv", append = FALSE, col_names = TRUE, delim = "#")
