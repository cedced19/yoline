{% extends 'layout.swig' %}

{% block title %}Home{% endblock %}

{% block content %}
<h1>Posts</h2>
<p>There are <strong>{{ posts.length }}</strong> posts!</p>
<ul class="posts">
    {% for post in posts %}
      <li>
        <h2>{{ post.attributes.title }}</h2>
        <span class="time">{{ post.attributes.date }}</span>
        <p><a href="/post/{{ post.url }}">Read post</a></p>
      </li>
    {% endfor %}
</ul>
{% endblock %}
