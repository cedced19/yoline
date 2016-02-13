{% extends 'layout.swig' %}

{% block title %}{{ post.attributes.title }}{% endblock %}

{% block content %}
  <h1>{{ post.attributes.title }}</h1>
  <span class="time">{{ post.attributes.date }}</span>
  {% autoescape false %}
  <p>{{ post.body }}</p>
  {% endautoescape %}
{% endblock %}
