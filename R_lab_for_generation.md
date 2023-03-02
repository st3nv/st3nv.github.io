---
layout: minimal
title: R lab
permalink: /Rlabtest.html
---
# This is the R playground for the R_lab

Table of Contents
# Table of Contents
1. [Basic R](#basic)
2. [Reading Data](#readdata)



## 1. Basic R <a name="basic"></a>

### 1.1. Hello World!

```{r}
```{r}
print("Hello World!")
5 + 5
```

### 1.2. Variables

```{r}
x <- 5
y <- 6
x + y

text <- "Hello World!"
paste(text, x)
```

### 1.3. Vectors

```{r}
x <- c(1, 2, 3, 4, 5)
y <- c(6, 7, 8, 9, 10)
x + y

x <- c('1', '2', '3', '4', '5')
```

### 1.4. Matrices

```{r}
x <- matrix(c(1, 2, 3, 4, 5, 6), nrow = 2, ncol = 3)
y <- matrix(c(7, 8, 9, 10, 11, 12), nrow = 3, ncol = 2)
x %*% y
```

### 1.5. Data Frames

```{r}
x <- data.frame(name = c("John", "Mary", "Peter"), age = c(20, 21, 22))
x
x[1, 1]
x[1, ]
x[c(1, 3), c(1, 2)]
```

### 1.6. Datatables

```{r}
x <- data.table(name = c("John", "Mary", "Peter"), age = c(20, 21, 22))
x
```

## 2. Reading Data <a name="readdata"></a>

### 2.1 CSV files
    
```{r}
URL = "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv"
x <- read.csv(URL)
x <- read.table(URL, sep = ",", header = TRUE)
```

### 2.2 Excel files

```{r}
install.packages("readxl")
library(readxl)
xlsx_example <- readxl_example("datasets.xlsx")
x <- read_excel(xlsx_example)
```

Now try it yourself! Just copy and paste

<div align="center">
<iframe width='100%' height='368' src='https://rdrr.io/snippets/embed/?code=print(%22Hello%2C%20world!%22)' frameborder='0'></iframe>
</div>



