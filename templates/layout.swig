<html>
<head>
  <title>{% block title %}Blog{% endblock %} - {{ meta.title }}</title>
  <link rel="stylesheet" href="/stylesheets/styles.css" charset="utf-8">
  <meta name="description" content="{{ meta.description }}">
  <meta name="author" content="{{ meta.author }}">
  <meta property="og:title" content="{% block title %}Blog{% endblock %} - {{ meta.title }}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="http://{{ meta.url }}">
  <meta property="og:description" content="{{ meta.description }}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@{{ meta.twitter }}">
  <meta name="twitter:url" content="http://{{ meta.url }}">
  <meta name="twitter:title" content="{% block title %}Blog{% endblock %} - {{ meta.title }}">
  <meta name="twitter:description" content="{{ meta.description }}">
  <meta name=viewport content="width=device-width, initial-scale=1">
</head>
<body>
  <header>
    <div>
      <a href="/">{{ meta.title }}</a>
    </div>
  </header>
  <section class="content">
    {% block content %}
      <p>Missing content!</p>
    {% endblock %}
    <footer>
    	<p>
        © {{ meta.author }} {{ meta.year }}.
        <br>
        Powered by Yoline.
      </p>
    </footer>
  </section>
</body>
</html>
