# Single shared limiter — every route decorator and app.state.limiter must be
# the same instance, otherwise limits are counted in separate buckets.
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
