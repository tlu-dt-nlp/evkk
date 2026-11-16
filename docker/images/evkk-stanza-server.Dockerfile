FROM evkk-stanza

RUN pip install numpy \
&& pip install pandas \
&& pip install Flask \
&& pip install estnltk \
&& pip install nltk \
&& pip install --no-cache-dir scikit-learn \
&& pip install joblib \
&& pip install py3langid~=0.4.0 \
&& pip install pydevd-pycharm~=252.27397.106

COPY ./stanza-server/ /app/
ENTRYPOINT taskset -c $((CPU_CORE)) python /app/server.py
