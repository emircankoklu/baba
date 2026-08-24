# birthday_project __init__
from copy import copy
import django.template.context

# Python 3.14+ compatibility patch for Django BaseContext.__copy__
def _base_context_copy(self):
    duplicate = django.template.context.BaseContext()
    duplicate.__class__ = self.__class__
    duplicate.__dict__ = copy(self.__dict__)
    duplicate.dicts = self.dicts[:]
    return duplicate

django.template.context.BaseContext.__copy__ = _base_context_copy
