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

## Descriptive Data Analysis

### 1.1. Summary Statistics

```{r}
data(iris)
summary(iris$Sepal.Length)

# Mean
mean(iris$Sepal.Length)

# Median
median(iris$Sepal.Length)

# Standard Deviation
sd(iris$Sepal.Length)

# Variance
var(iris$Sepal.Length)

# Range
range(iris$Sepal.Length)

# Quantiles(Quartiles and Median in our example)
quantile(iris$Sepal.Length, probs = c(0.25, 0.5, 0.75)

# Interquartile Range
IQR(iris$Sepal.Length)

# Correlation
cor(iris$Sepal.Length, iris$Sepal.Width)

# Covariance
cov(iris$Sepal.Length, iris$Sepal.Width)
```

### 1.2. Frequency Tables and 

Frequency tables are used to summarize categorical data. They are used to count the number of times each category appears in a data set.

```{r}
table(iris$Species)

# Relative Frequency
prop.table(table(iris$Species))

# Two-way Tables
df <- data.frame(sport=c('Baseball', 'Baseball', 'Basketball', 'Football', 'Football','Baseball', 'Basketball'),
                 gender=c('Male', 'Female', 'Male', 'Male', 'Female', 'Male', 'Male'))
table(df$sport, df$gender)

# Two-way Tables with Relative Frequency
prop.table(table(df$sport, df$gender))

# Marginal distribution
# 1 = row, 2 = column, make sure to specify 
margin.table(table(df$sport, df$gender), 2)
margin.table(table(df$sport, df$gender), 1)

# Conditional distribution
prop.table(table(df$sport, df$gender), 2)
prop.table(table(df$sport, df$gender), 1)
```

## 3. Basic Plots

### 3.1. Stem and Leaf Plots

```{r}
score <- c(100, 100, 95, 93, 92, 80, 81, 89, 99, 88, 82, 90)
stem(score, scale = 0.5)
stem(score, scale = 1)

# What's the difference?
```
### 3.2. Histograms

```{r}
data(iris)

# 3 rows, 1 column subplots
par(mfrow = c(3, 1))

# breaks controls the number of bins
hist(iris$Sepal.Length, breaks = 5)
hist(iris$Sepal.Length, breaks = 10)

# freq = FALSE plots the relative frequency
hist(iris$Sepal.Length, breaks = 5, freq = FALSE)
```

### 3.3. Boxplots

```{r}
x = c(1,2,3,4,5,4,3,2,1,4,2,3,10)

boxplot(x)
# range controls the whiskers, if range = 0, whiskers are extended to the data extremes
boxplot(x, range=0)
```

### 3.4. Bar Plots

```{r}
# Ignore this at this moment
avg <- aggregate(iris$Sepal.Length, by = list(iris$Species), FUN = mean)
colnames(avg) <- c("Species", "value")

barplot(avg$value, names.arg = avg$Species)
barplot(value ~ Species, data = avg)

barplot(Sepal.Length ~ Species, data = iris, col = "red")
```

### 3.5. Scatterplots

```{r}
plot(iris$Sepal.Length, iris$Sepal.Width)
```

### 3.6. Line Plots

```{r}
x <- c(1, 2, 3, 4, 5)
y <- c(1, 4, 9, 16, 25)
plot(x, y)
```




<div align="center">
<iframe width='100%' height='368' src='https://rdrr.io/snippets/embed/?code=' frameborder='0'></iframe>
</div>



