<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Exception Caught</title>
    <style>
        body {
            font-family: Consolas, monospace;
            background: #f4f4f4;
            color: #333;
            padding: 20px;
        }

        h1 {
            color: #d9534f;
        }

        pre {
            background: #eee;
            border: 1px solid #ccc;
            padding: 15px;
            overflow-x: auto;
        }
    </style>
</head>

<body>
    <h1>Uncaught Exception: <?= esc($exception->getMessage()) ?></h1>
    <p><strong>Type:</strong> <?= get_class($exception) ?></p>
    <p><strong>File:</strong> <?= $exception->getFile() ?></p>
    <p><strong>Line:</strong> <?= $exception->getLine() ?></p>
    <h2>Stack Trace:</h2>
    <pre><?= $exception->getTraceAsString() ?></pre>
</body>

</html>