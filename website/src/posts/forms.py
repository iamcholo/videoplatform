from django import forms

from posts.models import PostItem
from posts.models import PostCategory
from mptt.forms import TreeNodeChoiceField

class SearchForm(forms.Form):
	q = forms.CharField(max_length=255)
	def __init__(self, *args, **kwargs):
		super(SearchForm, self).__init__(*args, **kwargs)
		self.fields['q'].required = False
